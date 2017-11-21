# HTML & SASS Static Server

* Run a local server with live reload
* Automatically lint and compile SASS with support for Foundation
* Automatically copy HTML files and assets

## Getting Started

* Clone to a local directory
* Run `npm install`
* Run `gulp server`; server opens in a new tab

## Usage

* Save any Web page to `src/` along with saved assets 
* Add to bottom of HEAD tag in Web page: `<link rel="stylesheet" type="text/css" href="new.css">`
* Edit `src/new.scss`; changes are compiled out to `serve/new.css`, server reloads
* Edit `src/[whatever].html`; changes are copied to `serve/`, server reloads
* Tranfer changes back to files on a connected server when ready

## Maintenance

* Keep `scss` up-to-date
* Keep `style.stylelintrc` up-to-date 