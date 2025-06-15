#!/usr/bin/python
# -*- coding: utf-8 -*-

from enum import Enum

class TipoTransaccion(Enum):
    Emision = 1
    Validacion = 2
    Revocacion = 3
