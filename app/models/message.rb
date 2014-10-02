class Message
  include Mongoid::Document
  include Mongoid::Timestamps::Created

  field :encrypted_text, type: String
  field :expire_at, type: DateTime
end
