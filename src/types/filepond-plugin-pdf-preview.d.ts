// Le paquet `filepond-plugin-pdf-preview` (v1.x) ne fournit pas de types.
// Déclaration minimale : le plugin est passé tel quel à `registerPlugin`.
declare module 'filepond-plugin-pdf-preview' {
  const plugin: unknown;
  export default plugin;
}
