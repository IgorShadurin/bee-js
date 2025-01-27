import { beeDebugKy, beePeerDebugKy, commonMatchers } from '../../../utils'
import * as balance from '../../../../src/modules/debug/balance'
import * as connectivity from '../../../../src/modules/debug/connectivity'

// helper function to get the peer overlay address
async function getPeerOverlay() {
  const nodeAddresses = await connectivity.getNodeAddresses(beePeerDebugKy())

  return nodeAddresses.overlay
}

commonMatchers()

describe('balance', () => {
  describe('balances', () => {
    test('Get the balances with all known peers including prepaid services', async () => {
      const peerOverlay = await getPeerOverlay()
      const response = await balance.getAllBalances(beeDebugKy())

      expect(response.balances).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            peer: expect.any(String),
            balance: expect.any(String),
          }),
        ]),
      )

      const peerBalances = response.balances.map(peerBalance => peerBalance.peer)

      expect(peerBalances.includes(peerOverlay)).toBeTruthy()
    })

    test('Get the balances with all known peers including prepaid services', async () => {
      const peerOverlay = await getPeerOverlay()
      const peerBalance = await balance.getPeerBalance(beeDebugKy(), peerOverlay)

      expect(peerBalance.peer).toEqual(peerOverlay)
      expect(peerBalance.balance).toBeNumberString()
    })
  })

  describe('consumed', () => {
    test('Get the past due consumption balances with all known peers', async () => {
      const peerOverlay = await getPeerOverlay()
      const response = await balance.getPastDueConsumptionBalances(beeDebugKy())

      expect(response.balances).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            peer: expect.any(String),
            balance: expect.any(String),
          }),
        ]),
      )

      const peerBalances = response.balances.map(peerBalance => peerBalance.peer)

      expect(peerBalances.includes(peerOverlay)).toBeTruthy()
    })

    test('Get the past due consumption balance with a specific peer', async () => {
      const peerOverlay = await getPeerOverlay()
      const peerBalance = await balance.getPastDueConsumptionPeerBalance(beeDebugKy(), peerOverlay)

      expect(peerBalance.peer).toEqual(peerOverlay)
      expect(peerBalance.balance).toBeNumberString()
    })
  })
})
