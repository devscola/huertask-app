require 'grape'
require 'grape-entity'
require 'data_mapper'
require 'dm-timestamps'
require 'dotenv'
Dotenv.load

require_relative './models/task'
require_relative './models/person'
require_relative './entities/Task'
require_relative './entities/Category'
require_relative './entities/Person'
require_relative './entities/community'
require_relative './entities/category_task_relation'
require_relative './entities/person_task_relation'
require_relative './entities/plot'
require_relative './models/category'
require_relative './models/person'
require_relative './models/community'
require_relative './models/plot'
require_relative './models/task_community_relation'
require_relative './models/person_community_relation'
require_relative './models/community_invitation'
require_relative './models/category_person_relation'
require_relative './models/category_task_relation'
require_relative './models/person_task_relation'
require_relative './models/person_medal'
require_relative './db/fixtures'
require_relative './repositories/tasks'
require_relative './repositories/mailer'

module Huertask
  class API < Grape::API
    version 'v1', using: :header, vendor: 'huertask'
    format :json
    prefix :api

    resource :signup do
      post "/" do
        person = Person.signup(params)
        if person.save
          person.create_auth_token
          present person, with: Entities::Person
        else
          error_400(person)
        end
      end
    end

    resource :login do
      post "/" do
        username_or_email = params[:name] || params[:email]
        if person = Person.authenticate(username_or_email, params[:password])
          person.create_auth_token
          present person, with: Entities::PersonAfterLogin
        else
          error! "invalid username or password", 400
        end
      end
    end

    resource :reset_password do
      post '/' do
        person = Huertask::Person.first(:email => params[:email])
        return error!('Unauthorized', 401) unless person
        new_password = (1..6).map{(rand(26)+65).chr}.join
        person.set_password(new_password)
        if person.save
          Mailer.reset_password(params[:email], new_password)
        else
          error_400(person)
        end
      end
    end

    resource :tasks do
      route_param :task_id do

        resource :going do
          put '/' do
            going(:yes)
          end
        end

        resource :notgoing do
          put '/' do
            going(:no)
          end
        end

        params do
          optional :title,           type: String
          optional :categories,      type: Array
          optional :from_date,       type: DateTime
          optional :to_date,         type: DateTime
          optional :required_people, type: Integer
          optional :note,            type: String
          optional :status,          type: Integer
        end

        put '/' do
          admin_required

          begin
            task = Task.find_by_id(params[:task_id])
            task.update_fields(filter(params, false))
            if task.save
              present task, with: Entities::Task
            else
              error_400(task)
            end
          rescue Task::TaskNotFound => e
            error! e.message, 404
          end
        end

        delete '/' do
          admin_required

          begin
            task = Task.find_by_id(params[:task_id])
            if task.delete
              {}
            else
              error! task.errors.to_hash, 400
            end
          rescue Task::TaskNotFound => e
            error! e.message, 404
          end
        end

      end
    end

    resource :communities do
      params do
        requires :name,            type: String
        optional :description,     type: String
      end

      post '/' do
        login_required
        community = Community.new filter(params)
        community.people_relations.new(type: 1, person_id: current_user.id, community_id: community.id)
        if community.save
          present community, with: Entities::Community
        else
          error_400(community)
        end
      end

      route_param :community_id do

        get '/' do
          community = Community.find_by_id(params[:community_id])
          present community, with: Entities::Community
        end

        params do
          optional :name,                   type: String
          optional :description,            type: String
          optional :task_points_enabled,    type: Boolean
          optional :task_points_duration,   type: Integer
          optional :person_points_enabled,  type: Boolean
          optional :person_points_amount,   type: Integer
          optional :person_points_reload,   type: Integer
          optional :person_points_duration, type: Integer
        end

        put '/' do
          admin_required
          begin
            community = Community.find_by_id(params[:community_id])
            community.update_fields(declared(params, include_missing: false))
            if community.save
              present community, with: Entities::Community
            else
              error_400(community)
            end
          rescue Community::CommunityNotFound => e
            error! e.message, 404
          end
        end

        resource :plots do
          get '/' do
            begin
              community = Community.find_by_id(params[:community_id])
              present community.plots, with: Entities::Plot
            rescue Community::CommunityNotFound => e
              error! e.message, 404
            end
          end

          post '/' do
            begin
              admin_required
              community = Community.find_by_id(params[:community_id])
              community.create_plots(params[:prefix], params[:quantity])
              if community.save
                present community, with: Entities::Community
              else
                error_400(community)
              end
            rescue Community::CommunityNotFound => e
              error! e.message, 404
            end
          end
        end

        resource :invite do
          post '/' do
            begin
              admin_required
              community = Community.find_by_id(params[:community_id])
              community.invite_people(params)
              if community.save
                present community, with: Entities::Community
              else
                error_400(community)
              end
            rescue Person::PersonNotFound => e
              error! e.message, 404
            rescue Community::CommunityNotFound => e
              error! e.message, 404
            end
          end
        end

        resource :join do
          post '/' do
            joining(:join)
          end

          delete '/' do
            begin
              community = Community.find_by_id(params[:community_id])
              person = Person.find_by_id(headers['Unjoined'])
              community.unjoin(person)
              if community.save
                present community, with: Entities::Community
              else
                error_400(community)
              end
            rescue Community::CommunityNotFound => e
              error! e.message, 404
            rescue Person::PersonNotFound => e
              error! e.message, 404
            end
          end

          put '/' do
            begin
              community = Community.find_by_id(params[:community_id])
              person = Person.find_by_id(headers['Admin-Toggled'])
              community.toggle_admin(person)
              if community.save
                present community, with: Entities::Community
              else
                error_400(community)
              end
            rescue Community::CommunityNotFound => e
              error! e.message, 404
            rescue Person::PersonNotFound => e
              error! e.message, 404
            end
          end
        end

        resource :categories do
          get "/" do
            community = Community.find_by_id(params[:community_id])
            present community.categories.active, with: Entities::Category
          end

          params do
            requires :name,           type: String
            optional :description,    type: String
            optional :mandatory,      type: Boolean
          end

          post '/' do
            admin_required

            community = Community.find_by_id(params[:community_id])
            category = Category.new declared(params)
            category.community = community
            if category.save
              present category, with: Entities::Category
            else
              error_400(category)
            end
          end
        end

        resource :people do
          route_param :person_id do
            resource :tasks do

              get "/" do
                community = Community.find_by_id(params[:community_id])
                skip_categories = Person.get_skipped_categories(params[:person_id])

                return present community.past_tasks(skip_categories), with: Entities::Task if params[:filter] == 'past'
                present community.future_tasks(skip_categories), with: Entities::Task
              end

              params do
                optional :title,           type: String
                optional :categories,      type: Array
                optional :from_date,       type: DateTime
                optional :to_date,         type: DateTime
                optional :required_people, type: Integer
                optional :note,            type: String
                optional :community_id,    type: Integer
              end

              post '/' do
                admin_required
                community = Community.find_by_id(params[:community_id])
                task = Task.new filter(params)
                community.tasks << task
                if task.save && community.save
                  present task, with: Entities::Task
                else
                  error_400(task)
                end
              end
            end

            resource :points do
              get "/" do
                login_required
                present current_user, with: Entities::PersonPoints
              end

              post '/donate' do
                login_required(params[:sender_id])
                begin
                  receiver = Person.find_by_id(params[:receiver_id])
                  if point = current_user.donate_person_points(receiver, params[:community_id], params[:description])
                    present point
                  else
                    error_400(current_user)
                  end
                rescue Person::InsufficientAvailablePersonPoints => e
                  error! e.message, 405
                end
              end
            end
          end
        end
      end
    end

    helpers do
      DataMapper::setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/tasks.db")
      DataMapper.auto_upgrade!

      def error_400(model)
        error! model.errors.to_hash, 400
      end

      def current_user
        Person.find_by_token(headers["Token"]) if headers["Token"]
      end

      def login_required(id = nil)
        return error!('Unauthorized', 401) unless current_user && current_user.validate_auth_token(headers["Token"])
        return error!('Unauthorized', 401) unless id == nil || current_user.id == id
      end

      def admin_required
        return error!('Unauthorized', 401) unless current_user && current_user.is_admin?
      end

      def action(is_going)
        return :unroll if is_going == :no
        :enroll if is_going == :yes
      end

      def going(is_going)
        begin
          method = action(is_going)

          task = Task.find_by_id(params[:task_id])

          person = Person.find_by_id(params[:person_id])

          relation = Repository::Tasks.send(method, task, person)

          if relation.save
            present task, with: Entities::Task
          else
            error_400(relation)
          end
        rescue Task::TaskNotFound => e
          error! e.message, 404
        rescue Person::PersonNotFound => e
          error! e.message, 404
        end
      end

      def joining(method)
        begin
          community = Community.find_by_id(params[:community_id])
          person = Person.find_by_token(headers["Token"])
          community.send(method, current_user)
          if community.save
            present community, with: Entities::Community
          else
            error_400(community)
          end
        rescue Community::CommunityNotFound => e
          error! e.message, 404
        rescue Person::PersonNotFound => e
          error! e.message, 404
        end
      end

      def filter(params, missing = true)
        params = declared(params, include_missing: missing)
        if params.key?('categories')
          params['categories'] = Category.find_by_ids(params['categories'])
        end
        params
      end
    end

    resource :categories do
      route_param :id do

        params do
          optional :name,           type: String
          optional :description,    type: String
          optional :mandatory,      type: Boolean
        end

        put '/' do
          admin_required

          begin
            category = Category.find_by_id(params[:id])
            category.update_fields(declared(params))
            if category.save
              present category, with: Entities::Category
            else
              error_400(category)
            end
          rescue Category::CategoryNotFound => e
            error! e.message, 404
          end
        end

        delete '/' do
          admin_required

          begin
            category = Category.find_by_id(params[:id])
            if category.delete
              {}
            else
              error! category.errors.to_hash, 400
            end
          rescue Category::CategoryNotFound => e
            error! e.message, 404
          end
        end
      end
    end

    resource :people do
      route_param :id do
        get "/" do
          present Person.find_by_id(params[:id]), with: Entities::Person
        end

        resource :categories do
          route_param :category_id do
            post "/" do
              person = Person.find_by_id(params[:id])
              if person.add_favorite_category(params[:category_id])
                present person, with: Entities::Person
              else
                error_400(person)
              end
            end
            delete "/" do
              person = Person.find_by_id(params[:id])
              if person.remove_favorite_category(params[:category_id])
                present person, with: Entities::Person
              else
                error_400(person)
              end
            end
          end
        end
      end
    end
  end
end

