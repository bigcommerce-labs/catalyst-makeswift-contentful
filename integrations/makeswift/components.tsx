import { Style } from '@makeswift/runtime/controls';

import { runtime } from './runtime';

function HelloWorld(props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) {
  return <p {...props}>Hello, world!</p>;
}

runtime.registerComponent(HelloWorld, {
  type: 'catalyst-hello-world',
  label: 'Catalyst/Hello, World!',
  props: {
    className: Style(),
  },
});
