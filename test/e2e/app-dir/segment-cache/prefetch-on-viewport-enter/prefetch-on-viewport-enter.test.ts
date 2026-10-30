import { nextTestSetup } from 'e2e-utils'
import type * as Playwright from 'playwright'
import { createRouterAct } from 'router-act'

describe('segment cache prefetch on viewport enter', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })
  if (isNextDev) {
    // Prefetching on viewport is disabled in development.
    test('prefetching is disabled', () => {})
    return
  }

  it('prefetches a link when it scrolls into the viewport', async () => {
    let page: Playwright.Page
    // Every request issued for the target route, collected from before the
    // initial navigation. An `act` scope only sees the requests made while it
    // runs, so this is what proves the route wasn't prefetched during the
    // page load either.
    const targetRouteRequests: Array<string> = []
    const browser = await next.browser('/', {
      beforePageLoad(p: Playwright.Page) {
        page = p
        p.on('request', (request) => {
          if (new URL(request.url()).pathname === '/target') {
            targetRouteRequests.push(request.url())
          }
        })
      },
    })
    const act = createRouterAct(page)

    const checkpoint = await browser.elementByCss('#checkpoint')
    const link = await browser.elementByCss('a[href="/target"]')

    // Scroll down, but only as far as the checkpoint, which leaves the link
    // outside the viewport. The link is hidden, so it must not be prefetched,
    // even though the scroll itself fires the router's visibility observer.
    await act(async () => {
      await checkpoint.scrollIntoViewIfNeeded()
    }, 'no-requests')

    expect(targetRouteRequests).toEqual([])

    // Scroll the rest of the way, bringing the link into the viewport. Now the
    // target route is prefetched.
    await act(
      async () => {
        await link.scrollIntoViewIfNeeded()
      },
      { includes: 'Target page content' }
    )

    // The target route is fully static, so the prefetch is enough to render
    // it: navigating doesn't require any additional requests.
    await act(async () => {
      await link.click()
    }, 'no-requests')

    expect(await browser.elementById('target-content').text()).toBe(
      'Target page content'
    )
  })
})
