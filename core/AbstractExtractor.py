#!/usr/bin/env python3

import sys

class NoHTML(BaseException):
    pass

class AbstractExtractor:

    def __init__(self, destination, globals_):
        self.destination = destination
        self.globals_ = globals_


    def extract_information(self, file_):
        try:
            with open(self.globals_.config['indir'] + "/" + file_, "r") as ofile:
                self.extract_file(file_, ofile)
                ofile.close()

        except NoHTML as error:
            print("No HTML:"+file_,file=sys.stderr)
            raise

        except FileNotFoundError as error:
            print('File not found-Error:'+file_,file=sys.stderr)
            raise

        except IOError as error:
            print('File-Error:'+file_,file=sys.stderr)
            raise

    def extract_information_thread(self, q, thread_id):

        while not q.empty():
            file_ = q.get()
            success=True
            try:
                self.extract_information(file_)

            except FileNotFoundError as error:
                print('File not found-Error:' + str(no), file=sys.stderr)
                success=False
                continue

            except NoHTML as error:
                self.globals_.file_done(file_, False)
                success = False
                continue

            except IOError as error:
                print('File-Error:' + str(no), file=sys.stderr)
                success = False
                continue

            self.globals_.file_done(file_, success)
