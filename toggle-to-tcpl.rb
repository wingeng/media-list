#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'


if ARGV.length < 1 then
  puts "toggle-to-tcpl <isbn> " 
  return
end

isbn_db = 'isbn.db'
isbn = ARGV[0]

db = SQLite3::Database.new(isbn_db)

db.execute("update isbn set to_tcpl = not(to_tcpl) where isbn ==  '#{isbn}'")

db.close

