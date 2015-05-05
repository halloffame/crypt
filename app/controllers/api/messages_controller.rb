class Api::MessagesController < ApplicationController

  def show
    @message = Message.find(params[:id])
  end

  def create
    @message = Message.new(params[:message].permit(:encrypted_text))
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
