

## **File Templates** <sup style='opacity: 0.4; font-weight: 100; letter-spacing: -0.1em'>changelog</sup>


> **Next release's features**
>
> ### 0.0.2 Core Functions & Variables
>
> #### Highlights
>
>  - **Auto-populated variable placeholders** in templates, allowing for
>    * Environmental variables
>    * Placeholder variables that are replaced with user-defined values upon
>      creating a new file
>    * Predefined variables that are assigned automatically
>

---



## 0.0.1 **ALPHA<sup><span style='opacity:0.25; font-weight: 100'>[</span><span style='opacity:0.75'>&alpha;</span><span style='opacity:0.25; font-weight: 100'>]</span> </sup> Release**

<p style='font-weight: 300; opacity: 0.75; letter-spacing: 0.0875em; font-size: 1.4em'>
  <strong>Release date</strong>
  <time>2017-05-01</time>
</p>

  - **Container folder for template files**, for storing files used as templates.
    Located in the Atom storage folder
    * A single root directory for storing the template files
    * Directory named `file-templates` is created under the
      Atom's storage folder directory (defaults to _`~/.atom/storage/file-templates/`_)
    * All files located in the template directory are treated as templates and
      will be listed in the templates list whenever creating a new file
  - **Means to pre-populate a newly generated file** from a template upon creating
    a new file
  - **Context-aware new file dialog** similar to the [tree-view][tree-view-add-dialog]
    package's _New File_ dialog
    * Introduces an option to populate the new file from a certain template
    * Always uses current directory as a basis for where the new file is created
    * The file is not created until saved for the first time



[tree-view-add-dialog]: https://github.com/atom/tree-view/blob/master/lib/add-dialog.coffee
