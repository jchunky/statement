# guard

ignore(/.git/)
ignore(/.idea/)
ignore(/.rspec_status/)
ignore(/Gemfile.lock/)
ignore(/node_modules/)

watch(/.*/) do |match|
  path = match[0]
  puts "\n" + '=' * 80 + "\n"
  puts "file: #{path}"
  system "source ~/.bashrc; yarn eslint --fix #{path}; yarn test"
end
