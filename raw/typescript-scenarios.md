Homogeneous Arrays, arrays where the items can be of many type but the same for all items

```ts
type HomogeneousArray<T> = T[];
```

Object with self exclusive properties


```ts
interface ressourceIdentifier = { login: string, id?: never } | { id: number, login?: never };
```

Type of the value returned by a function

```ts
type User = ReturnType<typeof getUser>;
type FetchDataResult = Awaited<ReturnType<typeof fetchData>>; // for the value returned by an async function, if the function return a Promise<theType>, this is theType
```
