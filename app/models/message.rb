class Message < ActiveRecord::Base

  before_save :set_default_expire_values

  def is_still_valid?
    if expire_at > Time.now && expire_count > 0
      self.update_attribute(:expire_count, expire_count - 1)
      true
    else
      self.destroy
      false
    end
  end

  def expire_in_days=(value)
    self.expire_at = value.to_i.days.from_now if value.present?
  end

  private

  def set_default_expire_values
    self.expire_count ||= 0
    self.expire_at ||= 30.days.from_now
  end
end
