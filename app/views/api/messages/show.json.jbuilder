json.id @message.id.to_s
json.encrypted_text @message.encrypted_text
json.expires_in distance_of_time_in_words(@message.expire_at, Time.now)
json.expire_count @message.expire_count
