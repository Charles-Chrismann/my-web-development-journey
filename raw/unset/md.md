# Use full power of markdown

Markdown is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is easier to read in its source code form. Markdown is widely used for blogging and instant messaging, and also used elsewhere in online forums, collaborative software, documentation pages, and readme files.

Even if all many system uses Mardown, the rendered output might differ a little bit, a good way to visualize this is to compare how github and vscode renders the same Markdown input.

Here, i will only describe Markdown that works on github.

First of all, it is important to specify that several html tags produce the same output:

```Markdown
# This is a h1
<h1>This is also a h1</h1>
```

Here is a non exhaustive list of those correspondance

```Markdown
##
<h2></h2>

###
<h3></h3>

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
<table>
  <thead>
    <tr>
      <th>Syntax</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Header</td>
      <td>Title</td>
    </tr>
    <tr>
      <td>Paragraph</td>
      <td>Text</td>
    </tr>
  </tbody>
</table>
```

Markdown wrote using html can contain attributes, for example:

```Markdown
# This h1 is aligned on left
<h1 align="center">This h1 is centered</h1>
```

Personally, i use html tags only for special cases that can only be achieved this way. 