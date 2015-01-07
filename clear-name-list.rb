#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'


if ARGV.length < 1 then
  puts "clear-name-list <name> " 
  return
end

isbn_db = 'isbn.db'
name_str = ARGV[0]

db = SQLite3::Database.new(isbn_db)

db.execute("delete from list_names where name == '${name_str}';")

db.close

