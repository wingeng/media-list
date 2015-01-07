require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'

set :bind, '0.0.0.0'

get '/' do
  haml :index
end

get '/response' do
  "<table><tr><td>one</td><td>two</td></tr></table>"
end


get '/time' do
  "The time is " + Time.now.to_s
end

post '/scanner' do
  isbn = ""
  isbn = params[:isbn] if params[:isbn]
  "Post Looking for ISBN:" + isbn
end

get '/scanner' do
  isbn = ""
  isbn = params[:isbn] if params[:isbn]
  "Get Looking for ISBN:" + isbn
end

post '/reverse' do
  params[:word].reverse
end

#
# Insert isbn into media list and return the record found
#
post '/isbn-insert-media' do
  isbn = params[:isbn]
  list_name = params[:list_name]

  `./isbn-insert.rb isbn.db #{isbn} #{list_name} true`
end

#
# Get the list of media
#
get '/isbn-list-in-media' do
  sortby = params[:sort]
  desc = params[:desc]
  list_name = params[:list_name]
  limit_to = params[:limit_to]
  if (sortby) then
    sortarg = "--sortby '#{sortby} #{desc}'"
  else
    sortarg = ""
  end

  if (limit_to) then
    limit_to_arg = "--limitto #{limit_to}"
  else
    limit_to_arg = ""
  end

  list_name_arg = "--list-name #{list_name}"

  `./isbn-list-in-media.rb #{sortarg} #{list_name_arg} #{limit_to_arg}`
end

#
# Get the list of names
#
get '/list-names' do
  `./list-names.rb`
end

#
# Insert name_list
#
post '/name-list-insert' do
  list_name = params[:list_name]
  `./name-list-insert.rb '#{list_name}' `
end

post '/name-list-delete' do
  list_name = params[:list_name]
  `./name-list-delete.rb '#{list_name}' `
end

#
# Get CSV format
#
get '/tcpl-list.csv' do
  content_type "text/plain"
  `./media-list-csv.rb`
end

post '/delete-media' do
  isbn = params[:isbn]

  puts "deleting #{isbn}"

  if (isbn == nil || isbn == "") then
    puts " no isbn "
    {
      :return_code => false
    }.to_json
  else

    `./clear-media-list.rb #{isbn}`
    {
      :return_code => true
    }.to_json
  end
end


post '/toggle-to-tcpl' do
  isbn = params[:isbn]

  puts "toggle to tcpl #{isbn}"

  if (isbn == nil || isbn == "") then
    puts " no isbn "
    {
      :return_code => false
    }.to_json
  else

    `./toggle-to-tcpl.rb #{isbn}`
    {
      :return_code => true
    }.to_json
  end
end
