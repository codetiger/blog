rm -rf docs
gssg --url https://codetiger.github.io --dest docs --subDir blog
cp google* docs/
cp robots.txt docs/
find ./docs -iname "*.xml" -type f -exec sed -i '' 's/codetiger\.github\.io\/sitemap\.xsl/codetiger\.github\.io\/blog\/sitemap\.xsl/g' {} \;
