import { describe, it, expect } from 'vitest'

import { expandRRuleFromString } from '../src/expandRrule'
import { getBySetPos } from '../src/util'

describe('Other Cases', () => {
  describe('loop infinito com BYDAY invalido + BYSETPOS', () => {
    it('getBySetPos deve lancar erro (nao travar) quando byDay e invalido', () => {
      expect(() =>
        getBySetPos(
          new Date('2022-12-01T10:00:00.000Z'),
          'XX' as never,
          2,
          0,
          0
        )
      ).toThrow()
    })

    it(
      'MONTHLY com BYSETPOS + BYDAY invalido deve lancar erro rapidamente, nao travar',
      { timeout: 2000 },
      () => {
        const rRule =
          'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=XX;COUNT=3;WKST=SU'

        expect(() =>
          expandRRuleFromString(
            rRule,
            new Date('2022-12-15T10:00:00.000Z'),
            new Date('2023-12-31T10:00:00.000Z')
          )
        ).toThrow()
      }
    )

    it(
      'YEARLY com BYSETPOS + BYDAY invalido deve lancar erro rapidamente, nao travar',
      { timeout: 2000 },
      () => {
        const rRule =
          'DTSTART:20221216T100000Z\nRRULE:FREQ=YEARLY;INTERVAL=1;BYSETPOS=2;BYDAY=ZZ;BYMONTH=1;COUNT=3;WKST=SU'

        expect(() =>
          expandRRuleFromString(
            rRule,
            new Date('2022-12-15T10:00:00.000Z'),
            new Date('2023-12-31T10:00:00.000Z')
          )
        ).toThrow()
      }
    )
  })

  describe('BYDAY invalido em WEEKLY deve lancar erro', () => {
    it('lanca erro em vez de retornar silenciosamente 0 eventos', () => {
      const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=ZZ;COUNT=3;WKST=SU'

      expect(() =>
        expandRRuleFromString(
          rRule,
          new Date('2022-12-15T10:00:00.000Z'),
          new Date('2023-01-31T10:00:00.000Z')
        )
      ).toThrow()
    })
  })

  describe('BYSETPOS negativo alem de -1', () => {
    it('BYSETPOS=-2 (penultima quarta-feira do mes) deve funcionar', () => {
      const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=-2;BYDAY=WE;COUNT=3;WKST=SU'

      const r = expandRRuleFromString(
        rRule,
        new Date('2022-12-15T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
      )

      expect(r.r.hasErrors).toBe(false)
      // dezembro/2022: quartas em 7,14,21,28 -> penultima = 21
      expect(r.events[0].date.toISOString()).toEqual('2022-12-21T10:00:00.000Z')
    })
  })
})
