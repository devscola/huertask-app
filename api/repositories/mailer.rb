require 'pony'

module Mailer
  class << self
    def reset_password(user_mail, new_password)
      Pony.mail(
        :to => user_mail,
        :from => "huertohigo@gmail.com",
          :subject => "Tu contraseña ha sido cambiada",
          :body => "#{user_mail.split("@")[0]} tu nueva contraseña es #{new_password}",
          :via => :smtp,
          :via_options => {
            :address              => 'smtp.gmail.com',
            :port                 => '587',
            :enable_starttls_auto => true,
            :user_name            => 'huertohigo',
            :password             => ENV["MAIL_PASS"],
              :authentication     => :plain, # :plain, :login, :cram_md5, no auth by default
              :domain             => 'localhost' # the HELO domain provided by the client to the server
          }
      )
    end

    def send_invitation(user_mail, community, sender)
      body = "¡Hola agrourbanita! #{sender} te ha invitado al grupo #{community}, descárgate la app o entra para participar activamente y así hacer más sostenible el proyecto: botón/link Descarga la app y botón/link Entra (Importante: usa para registrarte o entrar esta misma dirección de correo electrónico en la que has recibido este correo de invitación) .  Tu has recibido este mail porque el equipo coordinador ha enviado una invitación a esta dirección. Si esta dirección no es correcta, habla con el equipo para que la cambien. ¿Tienes problemas con el enlace? Copia y pega este enlace en un navegador."

      Pony.mail(
        :to => user_mail,
        :from => "huertohigo@gmail.com",
          :subject => "Te han invitado a una comunidad",
          :body => body,
          :via => :smtp,
          :via_options => {
            :address              => 'smtp.gmail.com',
            :port                 => '587',
            :enable_starttls_auto => true,
            :user_name            => 'huertohigo',
            :password             => ENV["MAIL_PASS"],
              :authentication     => :plain, # :plain, :login, :cram_md5, no auth by default
              :domain             => 'localhost' # the HELO domain provided by the client to the server
          }
      )
    end
  end
end
