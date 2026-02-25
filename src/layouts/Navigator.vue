<template>
  <nav>
    <div class='nav-container'>
      <div class='nav-left'>
        <slot name='left'></slot>
      </div>

      <div class='nav-center'>
        <slot name='center'></slot>
      </div>

      <div class='nav-right'>
        <slot name='right'></slot>
      </div>
    </div>
  </nav>
</template>

<style lang='scss' scoped>
@use '../styles/abstract/m3-anim';

nav {
  position: sticky;
  top: 0px;

  display: flex;
  flex-direction: row;
  justify-content: center;

  flex: 0 0 3em;

  z-index: 100;

  transition: top m3-anim.$expressiveFastSpital;

  @media (orientation: landscape) {
    top: 12px;
  }

  .nav-container {
    flex: 0 0 100%;

    box-sizing: border-box;
    padding: 8px 1ch 8px 1ch;

    backdrop-filter: blur(10px);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    box-shadow: 0 0 5px 0px var(--pal-shadow);
    background-color: color(from var(--pal-secondaryContainer) srgb r g b / 0.8);
    color: var(--pal-onSecondaryContainer);

    transition:
      flex m3-anim.$standardSlowSpital,
      padding m3-anim.$standardSlowSpital,
      border-radius m3-anim.$expressiveSlowSpital;

    @media (orientation: landscape) {
      flex: 0 0 70%;
      padding-left: 3ch;
      padding-right: 3ch;

      border-radius: 50px;
      // border-bottom-right-radius: 25px;
    }
  }
}

.nav-container {
  >.site-logo {
    color: inherit;
  }

  >.site-logo:hover {
    font-weight: bolder;
  }

  .menu:hover {
    background-color: var(--pal-secondaryFixedDim);
    color: var(--pal-onSecondaryFixed)
  }

  @media (orientation: portrait) {
    font-size: 1.2em;
  }
}
</style>
