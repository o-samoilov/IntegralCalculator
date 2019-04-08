## What is this?

With this project you can model **contour integrals**.

**Example working project: [here](http://integrals.top/)**

The project base on [Three.js](https://threejs.org/)


## Getting Started

### Installing

Clone the project.

```
git clone https://github.com/a-samoylov/IntegralCalculator
```

Configure `public/js/configs.js`

You need set only `serverURL` this is path to [IntegralCalculatorServer](https://github.com/a-samoylov/IntegralCalculatorServer).

IntegralCalculatorServer - it is backend part of project write on PHP. Project by AJAX call to it and 
IntegralCalculatorServer calculate contour integrals value.

Example:

```js
var configs = {
    serverURL: "https://s.integrals.top/",
    helpURL:   "https://github.com/a-samoylov/IntegralCalculator/blob/master/README.md",
    gitHubURL: "https://github.com/a-samoylov/IntegralCalculator"
};
```

### Example

Axles:

- ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) - x
- ![#1589F0](https://placehold.it/15/1589F0/000000?text=+) - y
- ![#c5f015](https://placehold.it/15/c5f015/000000?text=+) - z


![alt text](https://raw.githubusercontent.com/a-samoylov/IntegralCalculator/master/Screenshots/Screenshot_1.png)

![alt text](https://raw.githubusercontent.com/a-samoylov/IntegralCalculator/master/Screenshots/Screenshot_2.png)


## Authors

Alexander Samoylov
> [LinkedIn](https://www.linkedin.com/in/alexander-samoylov/)

> [GitHub](https://github.com/a-samoylov)
