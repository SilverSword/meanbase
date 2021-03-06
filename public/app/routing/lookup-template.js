/**
 * The most important part of the app. This requests a page from the server that has a url property that matches the current window path. If found it will examine which template the page data uses. Instead of loading that template directly it will try to find which template it has been mapped to for this theme. It takes that mapped template and fetches it from the correct path provided by the  `meanbaseGlobals.themeTemplatePaths`. If there is any error in the this process it redirects to a missing page.
 */

export default (resolve, reject) => {
  (async() => {
    try {
      let pageTemplate = window.page.template

      if(!page) { throw 'Sorry but we could not find a page with that url' }

      // Loop through the template mapping stored in themeTemplates.
      // That variable came from the theme's theme.json file.
      // It finds which template to load based on the template that came back for the page
      // This is done to keep different themes' templates compatible
      let mappedTemplate = pageTemplate

      for (var property in meanbaseGlobals.themeTemplates) {
        if (meanbaseGlobals.themeTemplates.hasOwnProperty(property)) {
          if(meanbaseGlobals.themeTemplates[property].indexOf(mappedTemplate) > -1) {
            mappedTemplate = property;
            break;
          }
        }
      }
      // - Construct a url string from the theme name and template name to pass into $templateFactory
      if(!window.meanbaseGlobals.themeTemplatePaths[mappedTemplate]) {
        throw `Could not find template: ${pageTemplate}, try adding it to your theme template mapping`
      }

      var templatePath = window.meanbaseGlobals.themeTemplatePaths[mappedTemplate].template;

      if(!templatePath) {
        throw `Hmmm the ${pageTemplate} template is missing, make sure to add it to your theme's template mapping`
      }

      if(!templatePath) { throw 'No template path.' }

      let html = await $.get("../../" + templatePath)

      if(html) {
        let templateComponent = Vue.extend({
          template: html,
          props: ['pageSource', 'editMode', 'menus', 'currentUser', 'sortable'],
          data: () => ({

          }),
          computed: {
            page: function() {
              return _.cloneDeep(this.pageSource)
            }
          },
          created: function() {
            radio.$on('cms.autosave', () => {
              radio.$emit('cms.updatePage', this.page)
            })
          }
        })

        return resolve(templateComponent);
      } else {
        throw "Could not find the html for that template"
      }


    } catch(err) {
      console.log('Error loading template', err);
      toastr.error(err);
      const page = {
        tabTitle: 404,
        description: 'Could not find page',
        extensions: {},
        content: {},
        url: 'missing'
      };

      let templateComponent = Vue.extend({
        template: require('./missing.jade'),
        data:() => ({
          page
        })
      })

      return resolve(templateComponent);
    }
  })()
}
