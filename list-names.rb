#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'
require 'json'

isbn_db = "isbn.db"

db = SQLite3::Database.new(isbn_db)

h = []
db.execute("select name, current from list_names") do | rec |
  h += [ { :list_name => rec[0],
           :current => rec[1]
         } ]
end

puts h.to_json

db.close


