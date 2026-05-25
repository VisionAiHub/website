import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-4xl font-bold mt-10 mb-4 text-ink-50" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-3 text-ink-50" {...props} />,
    h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-2 text-ink-50" {...props} />,
    p: (props) => <p className="my-4 text-ink-200 leading-relaxed" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 my-4 space-y-1 text-ink-200" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 my-4 space-y-1 text-ink-200" {...props} />,
    a: (props) => <a className="text-brand-400 hover:underline" {...props} />,
    code: (props) => <code className="bg-ink-800 px-1.5 py-0.5 rounded text-sm text-brand-300" {...props} />,
    ...components,
  };
}
