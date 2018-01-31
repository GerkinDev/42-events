# 42-events

Use Diaspora:

```
# Clone last in-dev version of diaspora
git clone https://github.com/GerkinDev/diaspora.git diaspora
cd diaspora
# Use the webApi-flex branch
git checkout webApi-flex
# Link with NPM
npm link
# Go to working repo
cd ../42-events
# Add diaspora in-dev to node_modules
npm link diaspora
```
