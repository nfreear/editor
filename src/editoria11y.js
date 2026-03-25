import * as editoria11y from 'editoria11y';

/**
 * Testing Editoria11y!
 *
 * @see https://github.com/itmaybejj/editoria11y
 * @see https://editoria11y.princeton.edu/install/v3-configuration/
 */
export default function editoria11yTest () {
  const { Ed11y } = editoria11y;

  console.log('Editoria11y module (v3):', editoria11y);

  const ed11y = new Ed11y({
    checkRoots: ['main'],
    cssUrls: ['../editoria11y/editoria11y.css']
    // Was: cssUrls: ['assets/editoria11y.css']
  });

  console.log('Editoria11y:', ed11y);
}
