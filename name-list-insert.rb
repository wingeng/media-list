#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'
require 'json'

puts "name-list-insert <name> " if ARGV.length < 1

isbn_db = 'isbn.db'
name_str = ARGV[0]

db = SQLite3::Database.new(isbn_db)

insert_stmt = 'insert or replace into list_names(name, current) ' + 
  "VALUES('#{name_str}', 0);"

db.execute(insert_stmt)

db.close

puts '{"return-code" : true}'
