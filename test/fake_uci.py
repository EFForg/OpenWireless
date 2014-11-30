class FakeUci:
    def __init__(self):
        self.data = {}
        self.tmp = {}

    def get(self, name):
        return self.data[name]

    def set(self, name, value):
        self.tmp[name] = value

    def commit(self, section):
        self.data = dict(self.data.items() + self.tmp.items())
        self.tmp = {}
