import unittest

from fake_uci import FakeUci

class FakeUciTest(unittest.TestCase):
    def test_get_when_key_exists(self):
        uci = FakeUci(data = {'section.key': 1})

        self.assertEquals(1, uci.get('section.key'))

    def test_get_when_key_missing(self):
        uci = FakeUci(data = {})

        self.assertRaises(KeyError, uci.get, ('section.key'))

    def test_set_without_commit(self):
        uci = FakeUci()

        uci.set('section.key', 1)

        self.assertRaises(KeyError, uci.get, ('section.key'))

    def test_set_with_commit(self):
        uci = FakeUci()

        uci.set('section.key', 1)
        uci.commit('section')

        self.assertEquals(1, uci.get('section.key'))

    def test_set_with_commit_on_different_section(self):
        uci = FakeUci()

        uci.set('section.key', 1)
        uci.commit('section1')

        self.assertRaises(KeyError, uci.get, ('section.key'))

    def test_set_with_commit_on_section_after_commit_on_different_section(self):
        uci = FakeUci()

        uci.set('section.key', 1)
        uci.commit('section1')
        uci.commit('section')

        self.assertEquals(1, uci.get('section.key'))
