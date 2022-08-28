<br />
<div align="center">
  <a href="https://github.com/lirkang/likan">
    <img src="public/images/likan.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Likan</h3>

  <p align="center">
    An awesome vscode extension!
  </p>
</div>

## Features

![product-screenshot](public/images/screen-shot-base.png)

<p align="center">process env</p>

![product-screenshot](public/images/screen-shot-path.png)

<p align="center">no tsconfig.json alias path jump</p>

![product-screenshot](public/images/screen-shot-linked_editing.png)

<p align="center">linked editing and doc comment</p>

![product-screenshot](public/images/screen-shot-statusbar.png)

<p align="center">statusbar information</p>

## Configuration

File suffix automatically added when querying jumps.

- **default**:

```json
{
  "likan.language.exts": [".js", ".ts", ".jsx", ".tsx"]
}
```

Query the alias mapping of jump files.

- **default**:

```json
{
  "likan.list.alias": {
    "@": "${root}/src",
    "~": "${root}"
  }
}
```

And more...

## License

Distributed under the MIT License. See `LICENSE` for more information.
