# 42-events

Use Diaspora:

```
# Clone last in-dev version of diaspora
git clone https://github.com/GerkinDev/diaspora.git diaspora
cd diaspora
# Use the webApi-flex branch
git checkout webApi-flex
# Install Diaspora dependencies
npm install
# Link with NPM
npm link
# Go to working repo
cd ../42-events
# Install deps
npm install
# Add diaspora in-dev to node_modules
npm link diaspora
```
