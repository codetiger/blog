rm -rf raw docs
gssg --url https://codetiger.github.io --dest raw --subDir blog
cp google* raw/
cp robots.txt raw/
find ./raw -iname "*.xml" -type f -exec sed -i '' 's/codetiger\.github\.io\/sitemap\.xsl/codetiger\.github\.io\/blog\/sitemap\.xsl/g' {} \;

find ./raw -iname "*.css" -type f -exec cssnano {} {} \;
find ./raw -iname "*.html" -type f -exec html-minifier --collapse-whitespace {} -o {} \;
find ./raw -iname "*.js" -type f -exec uglifyjs --compress --mangle -o {} -- {} \;

mv raw docs