---
title: Runtime API Examples
timeModified: 2026/01/01 11:45:14
---

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

```rs
fn main() {
  println!("sb");
}
```

```cpp
#include <iostream>

int main() {
  std::cout << "sb thing" << " stupid c++++++++++++++++++++++++++++++++++++++++++++++++++" << std::endl;
}
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre style='overflow-x:auto'>{{ theme }}</pre>

#### xun

##### unx

###### nux

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>

<heimu>hello?</heimu>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
