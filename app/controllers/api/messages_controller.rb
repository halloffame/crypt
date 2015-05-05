class Api::MessagesController < ApplicationController

  def show
    @message = Message.find(params[:id])

    if @message.is_still_valid? # this method will delete if not valid
      render :show
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  def create
    @message = Message.new(params[:message].permit(:encrypted_text, :expire_count))
    @message.expire_in_days = params[:expire_in_days]

    if @message.save
      render :show
    else
      raise 'ahhhh error'
    end
  end

  def destroy
    @message = Message.find(params[:id])
    if @message.destroy
      render json: { success: true }
    else
      raise 'ahhhh error'
    end
  end

end
