## To Run execute following

## Step 1

`npm i --force`

## Step2

In node_modules/ngx-quill/lib/quill-editor.component.d.ts
replace line 1 i.e
`import QuillType, { Delta } from 'quill';`
with

`import QuillType from 'quill';`
`import Delta from 'quill';`

## Step3

`ng serve`
