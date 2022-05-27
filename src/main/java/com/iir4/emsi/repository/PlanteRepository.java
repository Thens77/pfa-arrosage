package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Plante;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Plante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlanteRepository extends JpaRepository<Plante, Long> {
	@Query("select p from Plante p where p.id in (select p.plante.id from Plantation p where p.zone.id=?1)")
	List<Plante> getByZone(Long id);
}
