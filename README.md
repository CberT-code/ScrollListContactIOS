# IosContactList Component for iOS-like Contact Style

This npm package provides a versatile and easy-to-use component that mimics the iOS Contacts app scroll list style. Ideal for developers looking to integrate a sleek and intuitive scrolling list interface into their applications, this component offers smooth scrolling, alphabetical sorting, and a familiar user experience that closely resembles the native iOS Contacts application.

## Features

- **iOS-like Design**: Achieve a polished and professional look with a component that closely mimics the iOS Contacts app scroll list.
- **Smooth Scrolling**: Enjoy fluid and responsive scrolling for an enhanced user experience.
- **Alphabetical Sorting**: Automatically sort your list items alphabetically for easy navigation.
- **Customizable**: Easily customize the appearance and behavior to fit your application's needs.
- **Easy Integration**: Simple to integrate into any project with minimal configuration.

## Installation

To install the package, run:

```sh
npm install iOSContactList
```

## How to Use

To use this component, you need to provide an array of objects containing the keys you want to sort. Optionally, you can include a `name` property if you want the display to be different from the key.

**Example**

```typescript
const data: Item[] = [
  { key: "Alan", name: "Alan (Work)" },
  { key: "John" },
  { key: "Jane", name: "Jane Doe" },
]
```

## Usage

Using the component is very straightforward:

**Code**

```jsx
<iOSContactList data={data} />
```

Feel free to customize further as needed!

## Next Steps

I will work on improving the section header behavior to get something closer to the real iOS experience (not pushing the previous header).

## Contributing

If you have suggestions for improvements or have found a bug, feel free to open an issue or submit a pull request. Your contributions are greatly appreciated!
