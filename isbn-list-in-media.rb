#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'
require 'json'
require 'trollop'

Opts = Trollop::options do
  opt :sortby, "Sort by timestamp | title | author | binding | date_of_publication",
                :type => :string, :default => "title"
  opt :limitto, "Limit media type", :type => :string
  opt :list_name, "Display list-name", :type => :string, :default => "all"
end

limit_clause = ""
case Opts.limitto
when "all"
  limit_clause = ""
when nil
  limit_clause = ""
when "cd"
  limit_clause = 'and binding like "%CD%"'
when "dvd"
  limit_clause = 'and binding like "%DVD%"'
when "books"
  limit_clause = 'and not (binding like "%DVD%" or binding like "%CD%")'
end

if (Opts.list_name != "all") then
  list_name_clause = "and list_name == '#{Opts.list_name}'"
end

isbn_db = "isbn.db"

db = SQLite3::Database.new(isbn_db)

h = []
db.execute("select isbn, author, title, date_of_publication, to_tcpl, binding, list_name from isbn where in_media == 1 #{limit_clause} #{list_name_clause} order by #{Opts.sortby}, title") do | rec |
  to_tcpl = false
  to_tcpl = true if (rec[4] == 1)
  
  h += [ { :isbn => rec[0],
           :author => rec[1],
           :title => rec[2],
           :date_of_publication => rec[3],
           :to_tcpl => to_tcpl,
           :binding => rec[5],
           :list_name => rec[6]
         } ]
end

puts h.to_json

db.close


