class Message < ActiveRecord::Migration
  def change
    create_table :messages, id: :uuid do |t|
      t.text :encrypted_text
      t.datetime :expire_at
      t.integer :expire_count
      
      t.timestamps null: false
    end
  end
end
