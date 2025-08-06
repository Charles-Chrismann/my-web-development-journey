Homogeneous Arrays, arrays where the items can be of many type but the same for all items

```ts
type HomogeneousArray<T> = T[];
```

Object with self exclusive properties


```ts
interface ressourceIdentifier = { login: string, id?: never } | { id: number, login?: never };
```
