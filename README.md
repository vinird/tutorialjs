<p align="center"> 
<img src="https://i.imgur.com/7C8p34p.png">
</p>




# Tutorialjs ![status alpha](https://img.shields.io/badge/status-alpha-yellow.svg)

Tutorialjs is a library to do a websites tutorial using popups.

It helps new user to get into a new application, showing step by step how to use all the components. 

This library is base on [Semantic UI elements](https://semantic-ui.com/) and it uses [Semantic UI popups](https://semantic-ui.com/modules/popup.html).



## How to contribute

***This project is alpha version (0.1.0).**

You can help following the [CONTRIBUTING.md](CONTRIBUTING.md) guidelines.

Also check the [issues](https://github.com/vinird/tutorialjs/issues).



## Dependencies  

**JQuery**

It main dependency is JQuery, it also uses Semantic UI styles and scripts but those are included in this repository.



## How to use it

Add Semantic UI CSS components

```html
<link rel="stylesheet" href="tutorial/semantic_components/popup.min.css">
<link rel="stylesheet" href="tutorial/semantic_components/transition.min.css">
```

Add Semantic UI Scripts

```html
<script src="tutorial/semantic_components/transition.min.js"></script>
<script src="tutorial/semantic_components/popup.min.js"></script>
```

Include **Tutorialjs** script

```html
<script src="tutorial/tutorial.js"></script>
```

#### Optional

If you want to use Semantic UI button styles you can add the following:

```html
<link rel="stylesheet" href="tutorial/semantic_components/button.min.css">
```



### HTML

In order to link HTML tags with Tutorialjs you must add a **``tutorial``** class to each tag you want to have a step tutorial. Also, you need to include a custom property to define the index of the step; **``tutorial-index="index:int"``**.

```html
<div class="tutorial" tutorial-index="0">
  
</div>
```

By default, the **start index is 0**.

To set a title and text to the popup you have to add a two more custom attributes:

**``tutorial-title="title"``**

**``tutorial-text="text"``**

```html
<div class="tutorial" tutorial-index="0" tutorial-title="My title" tutorial-text="My text">
  
</div>
```



The following is a tutorial with three index steps:

```html
<div class="tutorial" tutorial-index="0" tutorial-title="My title" tutorial-text="My text">
</div>

<div class="tutorial" tutorial-index="1" tutorial-title="My title" tutorial-text="My text">
</div>

<div class="tutorial" tutorial-index="2" tutorial-title="My title" tutorial-text="My text">
</div>
```



### Javascript

Once you have setup the HTML you are ready to run the tutorial. The simplest way to do it is using the **``start``** function of the **Tutorial** object, as follow:

```javascript
Tutorial.start().then((success) => {
    console.warn(success)
}).catch((error) => {
    console.warn(error)
})
```

Tutorialjs runs the **`start`** function as a **async promise** so you must use **`then`** and **`catch`** to way for the response.



#### Success response:

|     Value      |                                          |
| :------------: | ---------------------------------------- |
|  **finished**  | When the tutorial finish.                |
|  **canceled**  | When the tutorial is canceled.           |
| **outOfIndex** | When the tutorial meets **endIndex** option. |
|  **onlyOnce**  | When the tutorial has run and it has the **onlyOnce** option set to ``true``. |



#### Error response:

|           Value           |                                          |
| :-----------------------: | ---------------------------------------- |
| **Incorrect start index** | When the **startIndex** is not correct. Or **tutorial-index=""** is different than **startIndex**. |



## Options

The correct way to set options is assign then before you trigger the **``start``** function, here an example:

```javascript
Tutorial.startIndex = 0;
Tutorial.endIndex   = 4;

Tutorial.start().then((success) => {
    console.warn(success)
}).catch((error) => {
    console.warn(error)
})
```

 

#### Options available

|             Name             |             Accepted values              | Description                              |           Default           |
| :--------------------------: | :--------------------------------------: | :--------------------------------------- | :-------------------------: |
|        **startIndex**        |                  `int`                   | Start index point.                       |              0              |
|         **endIndex**         |                  `int`                   | End index point.                         |             999             |
|         **selector**         |             JQuery selector              | Selector, example:  `".className"` `".intro,.demo"`  `"[href='default.htm']"`. |        `".tutorial"`        |
|         **onlyOnce**         |              `true` `false`              | It uses the current URL to determinate if the tutorial was already ran. And sets cookies to evaluate it next time it runs. |           `false`           |
|          **styles**          |              `true` `false`              | Applies custom styles to the container of each step. |          ``true``           |
|        **bodyScroll**        |              `true` `false`              | If true it uses `"body"` tag to scroll otherwise it uses `"html"` tag. |          ``false``          |
| **removeAnimationConflicts** |              `true` `false`              | If true it overrides `".animated"` class with css ``animation: unset``. This helpful if you are using Animate.css. |          ``false``          |
|       **btnFramework**       | `"semantic"` `"bootstrap"` `"materialize"` ``"custom"`` | Set the css framework for styling the buttons. If you use ``"custom"`` you must set ``btnFinishClass`` and  ``btnNextClass``. |       ``"semantic"``        |
|      **btnFinishText**       |                 `string`                 | Set the text for the finish button.      |        ``"Cancel"``         |
|      **btnFinishClass**      |                 `string`                 | Set the custom classes for the finish button. | ``"ui button tiny basic"``  |
|       **btnNextText**        |                 `string`                 | Set the text for the next button.        |         ``"Next"``          |
|       **btnNextClass**       |                 `string`                 | Set the custom classes for the next button. | ``"ui button tiny primary`` |



## License ![MIT](https://img.shields.io/apm/l/vim-mode.svg)

The Tutorialj library is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).
