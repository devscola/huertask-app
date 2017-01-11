require 'pony'

module Mailer
  class << self
    def reset_password(user_mail, new_password)
      Pony.mail(
        :to => user_mail,
        :from => "miguelmundiaragones@gmail.com",
          :subject => "Tu contraseña ha sido cambiada",
          :body => "#{user_mail.split("@")[0]} tu nueva contraseña es #{new_password}",
          :via => :smtp,
          :via_options => {
            :address              => 'smtp.gmail.com',
            :port                 => '587',
            :enable_starttls_auto => true,
            :user_name            => 'miguelmundiaragones',
            :password             => ENV["MAIL_PASS"],
              :authentication     => :plain, # :plain, :login, :cram_md5, no auth by default
              :domain             => 'localhost' # the HELO domain provided by the client to the server
          }
      )
    end
  end
end
