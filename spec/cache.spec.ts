/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Cache } from '../src/cache'

describe('Cache', () => {
  let cache: Cache<string>

  describe('of size 1', () => {
    beforeEach(() => (cache = new Cache<string>(1)))

    it('should only contain the last insterted key', () => {
      cache.insert('a', 'value')
      cache.insert('b', 'value')
      expect(cache.contains('a')).toBe(false)
      expect(cache.contains('b')).toBe(true)
      cache.insert('c', 'value')
      expect(cache.contains('b')).toBe(false)
      expect(cache.contains('c')).toBe(true)
    })

    it('should return propper length', () => {
      cache.insert('a', 'value')
      expect(cache.length()).toEqual(1)
      cache.insert('b', 'value')
      expect(cache.length()).toEqual(1)
    })
  })

  describe('of size 3', () => {
    beforeEach(() => (cache = new Cache<string>(3)))

    it('should only contain the three last inserted keys', () => {
      cache.insert('a', 'value')
      cache.insert('b', 'value')
      cache.insert('c', 'value')
      cache.insert('d', 'value')
      expect(cache.contains('a')).toBe(false)
      expect(cache.contains('b')).toBe(true)
      expect(cache.contains('c')).toBe(true)
      expect(cache.contains('d')).toBe(true)
      cache.insert('e', 'value')
      expect(cache.contains('b')).toBe(false)
      expect(cache.contains('c')).toBe(true)
      expect(cache.contains('d')).toBe(true)
      expect(cache.contains('e')).toBe(true)
    })

    it('should keep two insertd keys after repeatedly inserting a third one', () => {
      cache.insert('a', 'value')
      cache.insert('b', 'value')
      cache.insert('c', 'value')
      cache.insert('c', 'value')
      cache.insert('c', 'value')
      expect(cache.contains('a')).toBe(true)
      expect(cache.contains('b')).toBe(true)
    })

    it('should return propper length', () => {
      cache.insert('a', 'value')
      cache.insert('b', 'value')
      cache.insert('c', 'value')
      cache.insert('d', 'value')
      expect(cache.length()).toEqual(3)
      cache.insert('e', 'value')
      expect(cache.length()).toEqual(3)
    })
  })

  describe('after reading a key', () => {
    beforeEach(() => {
      cache = new Cache<string>(1)
      cache.insert('key', 'value')
    })

    it('should contain this key', () => {
      expect(cache.contains('key')).toBe(true)
    })

    it('should return the inserted value', () => {
      expect(cache.get('key')).toEqual('value')
    })
  })
})
