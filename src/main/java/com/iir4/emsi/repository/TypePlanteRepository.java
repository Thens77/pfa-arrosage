package com.iir4.emsi.repository;

import com.iir4.emsi.domain.TypePlante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypePlante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypePlanteRepository extends JpaRepository<TypePlante, Long> {}
