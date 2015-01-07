#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'
require 'json'

puts "name-list-delete <name> " if ARGV.length < 1

isbn_db = 'isbn.db'
name_str = ARGV[0]

db = SQLite3::Database.new(isbn_db)

insert_stmt = "delete from list_names where name == '#{name_str}'";

db.execute(insert_stmt)

db.close

puts '{"return-code" : true}'
