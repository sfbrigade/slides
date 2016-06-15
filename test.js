var request = require('superagent')
var _ = require('lodash')
var InternalPromise = Promise || require('bluebird')

var urlTail = '&usp=sharing&tid=0B8Ycj67zPk24QzV2b2tfaDVOZlU'

var folderUrl = 'https://drive.google.com/folderview?id='

var parentFolderId = '0B3CHxhx2-3cObW84c3liV1Zxbms'

request.get([folderUrl, parentFolderId, urlTail].join('')).end(function(err, results){
  if(err) throw err
  var page = results.text
  var folders = parseParentFolder(page)
  console.log(folders)
  var folderRequests = []
  _.forEach(folders, function(folder){
    folderRequests.push(requestFolder(folder))
  })
  InternalPromise.all(folderRequests).then(function(folders){
    // console.log(folders)
  }).catch(function(err){
    throw err
  })
})
function requestFolder(folder){
  return new InternalPromise(function(resolve, reject){
    request.get([folderUrl, folder.id, urlTail].join('')).end(function(err, results){
      if(err) reject(err)
      var page = results.text
      folder.data = parseDateFolder(page)
      resolve(folder)
    })
  })
}
function parseParentFolder(content){
  var folderFront = 'var data = {folderModel: '
  var folderBack = ', folderName: \'Hack Night\''
  var folderModel = content.split(folderFront)[1]
  folderModel = folderModel.split(folderBack)[0]
  folderModel = fixJSONIssues(folderModel)
  try {
    var folders = JSON.parse(folderModel)
  } catch(e){
    console.error('An Error occured!')
    throw e
  }
  folders = _.map(folders, function(folder){
    return {
      id:folder[0]
    }
  })
  return folders
}
function parseDateFolder(content){
  var titleFront = '<title>'
  var titleBack = '</title>'
  var viewerItemsFront = ', viewerItems: '
  var viewerItemsBack = ',}; _initFolderLandingPageApplication'
  var title = content.split(titleFront)[1]
  title = title.split(titleBack)[1]
  var viewerItems = content.split(viewerItemsFront)[1]
  viewerItems = viewerItems.split(viewerItemsBack)[0]
  viewerItems = fixJSONIssues(viewerItems)
  console.log(viewerItems)
  try {
    var items = JSON.parse(viewerItems)
  } catch(e){
    console.error('An Error occured!')
    throw e
  }
  console.log(items)
  return items
  // no end, since the end of the document is the end of the object
}

function fixJSONIssues (content){
  if(content.indexOf(',,') > -1){
    content = content.split(',,').join(',')
    return fixJSONIssues(content)
  }
  if(content.indexOf('[,') > -1){
    content = content.split('[,').join('[')
    return fixJSONIssues(content)
  }
  return content
}
// var conversionDict = {
//   '\\u0026': '&'
//   '\\u003d': '='
// }

// Date folder return:
// <!DOCTYPE html><html><head><title>20160302</title><meta http-equiv="content-type" content="text/html; charset=utf-8"/><link rel="shortcut icon" href="//ssl.gstatic.com/docs/collections/images/favicon_shared.ico"/><link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&amp;lang=en" rel="stylesheet"><link href="/static/doclist/client/css/3780946739-folderlandingpage.css" rel="stylesheet" /><script type="text/javascript" src="/static/doclist/client/js/531924928-doclist_folderlandingpage.js"></script>
// <script type="text/javascript" src="https://apis.google.com/js/client.js"></script></head><body><div id="flip-gb"></div><div class="flip-header"><div class="flip-header-logo"><a href="https://drive.google.com/?usp=folder"><img src="https://gstatic.com/images/branding/googlelogo/1x/googlelogo_color_120x44dp.png" width="120" height="44" border="0" alt="Google logo"/> Drive</a></div><div class="flip-header-button"><a href="https://drive.google.com/folderview?id=0B3CHxhx2-3cOM2pwTWdENGthOGM&amp;usp=sharing&amp;tid=0B8Ycj67zPk24QzV2b2tfaDVOZlU&amp;requireAuth=1"><div role="button" class="goog-inline-block jfk-button jfk-button-action flip-header-sign-in-button" tabindex="0"><span class="flip-header-sign-in-button-label">Sign in</span></div></a></div></div><div class="flip-butter-container"><div id="flip-butter"></div></div><div class="flip-folder-header"><div class="flip-view-mode-selector"><div role="button" class="goog-inline-block jfk-button jfk-button-standard jfk-button-narrow flip-list-view-button jfk-button-collapse-right" tabindex="0" title="List View" aria-label="List View"><div class="flip-list-view-button-icon drive-sprite-core-view-options-list"></div></div><div role="button" class="goog-inline-block jfk-button jfk-button-standard jfk-button-narrow flip-grid-view-button jfk-button-collapse-left" tabindex="0" title="Grid View" aria-label="Grid View"><div class="flip-grid-view-button-icon drive-sprite-core-view-options-grid"></div></div></div><div class="flip-folder-title"><span><a class="flip-top-folder-link" href="https://drive.google.com/folderview?id=0B8Ycj67zPk24QzV2b2tfaDVOZlU&amp;usp=sharing">Code for San Francisco Public Folder</a></span> <span class="flip-title-separator" dir="ltr" aria-hidden="true">&#8250;</span>  <span class="flip-title-ellipsis" aria-hidden="true">...</span> <span class="flip-title-separator" dir="ltr" aria-hidden="true">&#8250;</span> <span role="heading" aria-level="1">20160302</span></div><div class="flip-folder-item-count">1 item</div></div><div id="flip-contents" class="flip-contents flip-grid-view"><script>var fragmentHandler = function() {var fragment = window.location.hash.substring(1); var contentsEl = document.getElementById('flip-contents'); if (fragment == 'list') {contentsEl.className = contentsEl.className. replace('flip-grid-view', 'flip-list-view');} else if (fragment == 'grid') {contentsEl.className = contentsEl.className. replace('flip-list-view', 'flip-grid-view');}}; fragmentHandler(); if (window.addEventListener) {window.addEventListener('hashchange', fragmentHandler);} else {window.attachEvent('onhashchange', fragmentHandler);}</script><div class="flip-list-header"><div role="heading" aria-level="2" class="flip-list-title-header">TITLE</div><div role="heading" aria-level="2" class="flip-list-last-modified-header">LAST MODIFIED</div></div><div class="flip-entries"><div class="flip-entry" id="entry-1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c" tabindex="0" role="link"><div class="flip-entry-info"><div class="flip-entry-visual"><div class="flip-entry-visual-card"><div class="flip-entry-thumb"><img src="https://lh5.googleusercontent.com/rtjmKkkSyMzY8O92_DC63TTA2XHhxxnG5NGQ90Hq31wFRTaXwD2ZTu6ew6J5paHNXJEE5UK08VtQnJgvN8SN5w=s190" alt="Presentation"/></div></div></div><div class="flip-entry-list-icon"><img src="https://ssl.gstatic.com/docs/doclist/images/icon_11_presentation_list.png" alt=""/></div><div class="flip-entry-title">20160303_Welcome_HackNight</div></div><div class="flip-entry-last-modified"><div>Mar 2</div></div></div></div></div><script>var config = {tid: '0B8Ycj67zPk24QzV2b2tfaDVOZlU', locale: 'en', rtl:  false , protocolVersion:  6.0 , driveUrl: 'https:\/\/drive.google.com\/?usp\x3dfolder#folders\/0B8Ycj67zPk24QzV2b2tfaDVOZlU', editionName: 'ND',root: '0AA1tTk-hkwjdUk9PVA',vae: true,vare: true,vsie: true,vpie: true,vte: true,v2ue: true,vgde: true,vgmwbe: true,vrae: true,ix2e: true,vdoe: true,vse: true,vle: true,iph: 'https:\/\/youtube.googleapis.com',vase: true,vufivd: true,vwpie: true,vnse: true,vtx2e: true,vale: true,};; var data = {folderModel: [[,"1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c",,,"https://docs.google.com/presentation/d/1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c/edit?usp\u003ddrive_web"]
// ]
// , folderName: '20160302', viewerItems: [[,,"20160303_Welcome_HackNight","https://lh5.googleusercontent.com/rtjmKkkSyMzY8O92_DC63TTA2XHhxxnG5NGQ90Hq31wFRTaXwD2ZTu6ew6J5paHNXJEE5UK08VtQnJgvN8SN5w",,,,"1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c",,"1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c",,,"application/vnd.google-apps.punch",,,0,,"https://docs.google.com/presentation/d/1tUst5M0JZyYXQvD6CAwE_I6vzZog7j39GM6t65l7C-c/edit?usp\u003ddrive_web",,,,3]
// ]
// * Connection #0 to host drive.google.com left intact
// ,}; _initFolderLandingPageApplication(config, data);</script></body></html>
