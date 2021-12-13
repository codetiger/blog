rm -rf raw docs
gssg --url https://codetiger.github.io --dest raw --subDir blog
cp google* raw/
cp robots.txt raw/
find ./raw -iname "*.xml" -type f -exec sed -i '' 's/codetiger\.github\.io\/sitemap\.xsl/codetiger\.github\.io\/blog\/sitemap\.xsl/g' {} \;
minify -r -o ./ raw
mv raw docs