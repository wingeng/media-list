#!/usr/bin/ruby
#
require 'rubygems'
require 'sqlite3'
require 'json'

isbn_db = "isbn.db"


db = SQLite3::Database.new(isbn_db)

db.execute("select isbn, author, title, date_of_publication, to_tcpl from isbn where in_media == 1") do | rec |
  to_tcpl = ""
  to_tcpl = "to-tcpl" if (rec[4] == 1)
  
  # Remove commas cuz we are generating a comma separated file
  title = rec[2].gsub('"', "'")
  author = rec[1].gsub('"', "'")

  pub_date = "NA"
  if (rec[3] && rec[3] != "") then
      pub_date = rec[3].split("-")[0]
  end

  printf(%Q{%s, "%s", "%s", %s\n},
         to_tcpl,
         title,
         author,
         pub_date)
end


db.close
