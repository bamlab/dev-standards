# [MO] Optimize the render time of lists, tables and charts

## Owner: [Justine Mignot](https://github.com/justinemignot)

## Steps

- [ ] Find how many lines or data points are displayed on your page
- [ ] Decide if your end user should see them all
  - [ ] If it does not need all this data, try reducing its amount
  - [ ] If it does need all the data, see how to optimize render
  - Find solutions per components, "Charts, Maps, Tables and Lists" below

### Chart/Maps data optimization

> Why: On a project like Investo for BNP, we reduced by 50% the data points of a chart, we saved 2s on the page render time!

- Open your page with the chart
- Reduce by half the quantity of data displayed
- If the result is still clear enough for the end user, check how long it took to render (link to Thibaut's [article](https://blog.bam.tech/developper-news/5-tips-to-improve-performance-react-native-application) on how to investigate)
  - If the improvement is enough and the information clear for the user, perfect, you improved your performance and still helped your end user
  - If it's not enough, reproduce the previous step
  - If you can't manage to improve the performance and/or that you are now displaying too few points, you should investigate the render performance of your components, it means that the code is too heavy, not that you display too much data

### Tables/Lists render optimization

> Why: On a project like Galaxy for BNP, they displayed 50 lines instead of ~500, and users never clicked on the 'see more' button!

#### It does not need all this data, try reducing its amount

- Open your page with the table
- Reduce by half the quantity of lines displayed (or more if it makes more sense to display less on your project)
- Add a 'See more' button to allow your user to display all lines
  - If the improvement is enough, perfect, you improved your performance
  - If it's not enough, reproduce the previous step
  - If you can't manage to improve the performance and/or that you are now displaying too few points, you should investigate the render performance of your components, it means that the code is too heavy, not that you display too much data

#### If it does need all the data, see how to optimize render

- Pagination:

  - Back: only if the cause of slowness is the time of backend request (more than 2s)
    - paginate,
    - use lazy loading.
  - Front: if you want to minize elements to display and so gain on rendering time.

- React Native Components:

  - use [FlatList](https://facebook.github.io/react-native/docs/flatlist), [SectionList](https://facebook.github.io/react-native/docs/sectionlist), [VirtualizedList](https://facebook.github.io/react-native/docs/virtualizedlist)
    because it render items lazily, just when they are about to appear, and removes items that scroll way off screen to save memory and processing time
  - DO NOT USE `ScrollView`: it simply renders all its react child components at once, so it has a big performance downside!

- React library:
  - [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/List):
    great tool to display a big list with React.
    But implementing it add a not negligible complexity on your tickets. Take it into consideration.
