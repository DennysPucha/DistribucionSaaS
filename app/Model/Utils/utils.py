def calcular_dias_oferta_licencia(duracion_cantidad: int, duracion_unidad: str) -> int:
    """
    Calcula la duración total de una licencia en días según la cantidad y unidad de duración.
    
    Args:
        duracion_cantidad (int): Cantidad de duración.
        duracion_unidad (str): Unidad de duración ('dias', 'meses', 'años').
    
    Returns:
        int: Duración total en días.
    """
    if duracion_unidad == 'dias':
        return duracion_cantidad
    elif duracion_unidad == 'meses':
        return duracion_cantidad * 30
    elif duracion_unidad == 'años':
        return duracion_cantidad * 365
    else:
        raise ValueError("Unidad de duración no válida")