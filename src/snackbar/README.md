# igx-snackbar

**igx-snackbar** provides feedback about an operation by showing brief message at the bottom of the screen on mobile and lower left on larger devices. IgxSnackbar will appear above all  other elements on screen and only one can be displayed at a time.  
A walkthrough of how to get started can be found [here](https://www.infragistics.com/products/ignite-ui-angular/angular/components/snackbar.html)

# Usage

## Simple Snackbar

```html
<button (click)="snackbar.show()">Show snackbar</button>

<igx-snackbar #snackbar
            message="This is a simple snackbar!">
</igx-snackbar>
```

You can be more descriptive and set message `message="This is a simple snackbar!"`.

You can show the snacbar by using `snacbar.show()` method.


## Snackbar with button and action

```html
<button (click)="snackbar.show()">Show snackbar</button>

<igx-snackbar #snackbar
             message="This is a snackbar with a button and action!"
             actionName="Dismiss"
             (onAction)="snackbar.hide()">
</igx-snackbar>
```
You can set the id of the component by `id="Snackbar"` or will be automatically generated;

You can set the title of the button by setting `actionName="Dissmis"`;

You can hide the Snackbar by using `snackbar.hide()` method.

The Snackbar will be automatically hidden after 10000 milliseconds, this can be controller by the
`displayTime` attribute, the automatic hiding can be also controller by using the `autoHide` attribute.
