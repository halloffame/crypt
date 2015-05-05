namespace :messages do

  desc "purges expired messages"
  task purge: :environment do
    count = Message.expired.count
    if count > 0
      if Message.expired.destroy_all
        puts "All #{count} expired messages were purged"
      else
        puts "There was a problem deleting some expired messages"
      end
    else
      puts "No expired messages to delete"
    end
  end

end
